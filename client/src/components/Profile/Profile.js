import React from 'react';
import { USER_QUERY } from '../../queries/profile';
import { useQuery } from '@apollo/client';
import Logout from '../Logout/Logout';
import { useTheme } from '../../hooks/provideTheme';
import { useHistory } from 'react-router-dom';
import { RiMoonFill } from 'react-icons/ri';
import { HiSun } from 'react-icons/hi';
import { BiAddToQueue, BiMessageDetail, BiDetail } from 'react-icons/bi';
import { CgScrollH } from 'react-icons/cg';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsPlus } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';

import classNames from 'classnames/bind';
import { themes } from '../../constants/constants';
import { formatDateTimeString } from '../../services/utils';
const cx = classNames.bind(require('./Profile.module.scss'));

export default function Profile() {
    const { loading, error, data } = useQuery(USER_QUERY);
    const { toggleTheme, theme } = useTheme();
    const history = useHistory();

    return (
        <div className={cx('profileWrapper')}>
            <div className={cx('nav')}>
                <div className={cx('moonAndSunWrapper')}>
                    {theme === themes.dark ? (
                        <RiMoonFill
                            className={cx('moonAndSun', 'dark')}
                            onClick={() => toggleTheme()}
                        ></RiMoonFill>
                    ) : (
                        <HiSun
                            className={cx('moonAndSun', 'light')}
                            onClick={() => toggleTheme()}
                        ></HiSun>
                    )}
                </div>
                <div className={cx('logoutWrapper')}>
                    <Logout />
                </div>
                <button
                    className={cx('homeLink', '_btn')}
                    onClick={() => history.push('/home')}
                >
                    Home
                </button>
            </div>

            <div className={cx('profileData')}>
                {data?.me && (
                    <div className={cx('profileInfoWrapper')}>
                        <img
                            className={cx('profilePicture')}
                            alt="profile"
                            src={data.me.picture}
                        />
                        <div className={cx('userMeta')}>
                            <div className={cx('userName')}>{data.me.name}</div>
                            <div className={cx('joinDate')}>
                                Launched:{' '}
                                {formatDateTimeString(data.me.registered)}
                            </div>
                        </div>
                    </div>
                )}
                {loading && <p>Loading...</p>}
                {error && <p>Error :(</p>}
            </div>
            <div className={cx('helpWrapper')}>
                <div className={cx('helpTitle')}>Astronautics 101</div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>
                        Creating and selecting moons
                    </div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <Hamburger />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Use the 'moon selector' menu to create moons,
                                join moons via code, and select your active
                                moon.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>
                        Sharing your moon code
                    </div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <FiSend />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Click on the moon code to copy a unique link to
                                your moon. Send this to anyone you want to share
                                your moon with. Once they click the link,
                                they'll automatically be added as an astronaut
                                on your moon. The 6 character codes can also be
                                manually entered in the moon selector menu.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>Creating rooms</div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <BiAddToQueue />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Use the 'create room' button to open the room
                                creation menu. Here you can create rooms, delete
                                rooms, and select your active room.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>Posting</div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <BsPlus style={{ fontSize: 'xx-large' }} />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                To create a new post, press the + icon. This
                                will open the 'Post' menu. Select a room, give
                                your post a title, and optionally share a link,
                                write a description, rate what you're sharing,
                                and enter up to 10 tags. Once you press 'Post',
                                this info will be shared with your fellow
                                astronauts.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>
                        Viewing and replying to posts
                    </div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <BiMessageDetail />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Click on the box surrounding a post to view the
                                entire post. From here, the post author can edit
                                and delete their post. Any astronaut can reply
                                to the post from here as well. Replies will be
                                tagged on to the end of the post and can be
                                later edited and deleted by their author.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>Selecting a room</div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <CgScrollH />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Use the 'select room' panel to choose the active
                                room. The 'All' room contains posts from every
                                room. If some of the rooms are hidden, click and
                                drag left and right to scroll them into view.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>Searching</div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <AiOutlineSearch />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Use the search box to search for anything posted
                                to the active moon. To clear the search, clear
                                all characters from the search box. This will
                                search for a matching <i>title</i>, <i>link</i>,{' '}
                                <i>body</i>, or <i>tags</i>.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>Refreshing</div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <MdRefresh />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Use the refresh button to make sure you're all
                                up to date with the latest posts.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>Changing theme</div>
                    <div className={cx('helpBody')}>
                        <div
                            className={cx('helpIcon')}
                            onClick={() => toggleTheme()}
                        >
                            {theme === themes.dark ? <RiMoonFill /> : <HiSun />}
                        </div>
                        <div className={cx('help')}>
                            <p>
                                To toggle between light and dark mode, press the
                                moon / sun icon in the top left of this page.
                                Try it out by clicking the{' '}
                                {theme === themes.dark ? 'moon' : 'sun'} icon on
                                the left.
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('helpSection')}>
                    <div className={cx('helpSubtitle')}>
                        Viewing moon details
                    </div>
                    <div className={cx('helpBody')}>
                        <div className={cx('helpIcon')}>
                            <BiDetail />
                        </div>
                        <div className={cx('help')}>
                            <p>
                                Click the moon name in the top left corner to
                                view details about your moon. Here you can see a
                                list of astronauts and the mission commander.
                                Careful, the mission commander is able to
                                destroy the moon from here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Hamburger = () => {
    return (
        <div className={cx('hamburgerWrapper')}>
            <div className={cx('burger')}></div>
            <div className={cx('burger')}></div>
            <div className={cx('burger')}></div>
        </div>
    );
};
