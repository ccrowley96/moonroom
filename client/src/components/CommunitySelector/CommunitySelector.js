import React, { useEffect, useState } from 'react';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes } from '../../constants/constants';
import {
    JOIN_COMMUNITY,
    CREATE_COMMUNITY,
    MY_COMMUNITIES
} from '../../queries/community';
import MutationInput from '../MutationInput/MutationInput';
import { selectCommunity } from '../../services/utils';
import CommunityCodeLink from '../CommunityCodeLink/CommunityCodeLink';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./CommunitySelector.module.scss'));

const CommunitySelector = ({
    refetchActiveCommunity,
    communities,
    activeCommunity
}) => {
    const { appDispatch } = useAppState();
    const [selectedCommunity, setSelectedCommunity] = useState(
        activeCommunity ? activeCommunity.id : 'none'
    );

    const communityIds = communities?.map((c) => c.id);

    // Refetch active community on mount (ensures that up to date rooms will be displayed)
    useEffect(() => {
        refetchActiveCommunity();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        setSelectedCommunity(activeCommunity ? activeCommunity.id : 'none');
    }, [activeCommunity]);

    const handleCommunitySelectChange = (e) => {
        let selection = e.target.value;
        if (communityIds.indexOf(selection) === -1) {
            setSelectedCommunity('none');
            selectCommunity(null);
        } else {
            setSelectedCommunity(selection);
            selectCommunity(selection);
        }
    };

    return (
        <div
            className={cx('panelBlocker')}
            onClick={(e) =>
                appDispatch({
                    type: actionTypes.SET_ACTIVE_MODAL,
                    payload: null
                })
            }
        >
            <div
                className={cx('communitySelector', '_base-slideRight')}
                onClick={(e) => e.stopPropagation()}
            >
                {communities && communities.length > 0 && (
                    <>
                        {activeCommunity ? (
                            <div className={cx('_modalSection')}>
                                <div className={cx('activeCommunity')}>
                                    <h3 className={cx('communityName')}>
                                        Community: {activeCommunity.name}
                                    </h3>
                                    <CommunityCodeLink
                                        code={activeCommunity.code}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div className={cx('_modalSection')}>
                            <div className={cx('_sectionLabel')}>
                                {activeCommunity
                                    ? 'My communities'
                                    : 'Select community'}
                            </div>
                            <select
                                className={cx('_select')}
                                value={selectedCommunity}
                                onChange={handleCommunitySelectChange}
                            >
                                {/* Default option */}
                                <option
                                    key={'default'}
                                    value={'none'}
                                    disabled
                                    hidden
                                >
                                    Select community
                                </option>
                                {communities.map((community, idx) => {
                                    return (
                                        <option key={idx} value={community.id}>
                                            {community.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </>
                )}
                <div className={cx('_modalSection')}>
                    <MutationInput
                        mutationType={CREATE_COMMUNITY}
                        dataTitle={'Create community'}
                        dataKey={'addCommunity'}
                        maxLength={16}
                        placeholder={'Enter community name'}
                        inputVariable={'name'}
                        refetchQueries={[{ query: MY_COMMUNITIES }]}
                        onSuccess={(result) => {
                            let communityId =
                                result.data.addCommunity.community.id;
                            setSelectedCommunity(communityId);
                            selectCommunity(communityId);
                        }}
                    />
                    <MutationInput
                        mutationType={JOIN_COMMUNITY}
                        dataTitle={'Join community'}
                        dataKey={'joinCommunity'}
                        maxLength={8}
                        placeholder={'Enter community code'}
                        inputVariable={'code'}
                        refetchQueries={[{ query: MY_COMMUNITIES }]}
                        onSuccess={(result) => {
                            let communityId =
                                result.data.joinCommunity.community.id;
                            setSelectedCommunity(communityId);
                            selectCommunity(communityId);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommunitySelector;
