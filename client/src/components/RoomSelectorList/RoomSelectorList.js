import { useQuery, useReactiveVar } from '@apollo/client';
import classNames from 'classnames/bind';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';
import { GET_ACTIVE_COMMUNITY } from '../../queries/community';
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

    let rooms = activeCommunityData?.community?.rooms?.slice(0);

    if (rooms && rooms.length > 0) {
        rooms = rooms.sort((a, b) => {
            let textA = a.name.toUpperCase();
            let textB = b.name.toUpperCase();
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });

        rooms = [{ name: 'All', id: 'all' }, ...rooms];

        return (
            <div className={cx('roomSelectorWrapper')}>
                <div className={cx('roomSelector')}>
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
