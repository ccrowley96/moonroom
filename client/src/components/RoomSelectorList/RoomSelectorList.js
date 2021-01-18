import { useQuery, useReactiveVar } from '@apollo/client';
import classNames from 'classnames/bind';
import { useRef } from 'react';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';
import { GET_ACTIVE_COMMUNITY } from '../../queries/community';
import { isOverflown } from '../../services/utils';
import { CgScrollH } from 'react-icons/cg';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes, modalTypes } from '../../constants/constants';
const cx = classNames.bind(require('./RoomSelectorList.module.scss'));

const RoomSelectorList = () => {
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const { data: activeCommunityData } = useQuery(GET_ACTIVE_COMMUNITY, {
        variables: { communityId: activeCommunityId },
        skip: !activeCommunityId
    });
    const { appDispatch } = useAppState();

    const roomSelectorRef = useRef();
    let rooms = activeCommunityData?.community?.rooms?.slice(0);

    if (rooms && rooms.length > 0) {
        rooms = rooms.sort((a, b) => {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        rooms = [{ name: 'All', id: 'all' }, ...rooms];

        if (roomSelectorRef.current)
            console.log(isOverflown(roomSelectorRef.current));

        return (
            <div className={cx('roomSelectorWrapper')}>
                <div className={cx('roomSelector')} ref={roomSelectorRef}>
                    <div className={cx('rooms')}>
                        {rooms.map((room, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className={cx(
                                        'roomName',
                                        room.id === activeRoomId ||
                                            (activeRoomId === null &&
                                                room.id === 'all')
                                            ? 'active'
                                            : ''
                                    )}
                                    onClick={() => {
                                        activeRoomIdVar(
                                            room.id === 'all' ? null : room.id
                                        );
                                    }}
                                >
                                    {room.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className={cx('scrollIconWrapper')}>
                    <CgScrollH
                        className={cx('scrollIcon')}
                        onClick={() => {
                            appDispatch({
                                type: actionTypes.SET_ACTIVE_MODAL,
                                payload: modalTypes.ROOM_DETAILS
                            });
                        }}
                    />
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default RoomSelectorList;
