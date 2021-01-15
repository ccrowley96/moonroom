import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { JOIN_COMMUNITY, MY_COMMUNITIES } from '../../queries/community';
import { selectCommunity } from '../../services/utils';

const JoinCommunityLink = () => {
    let { code } = useParams();
    let history = useHistory();

    const [joinCommunity] = useMutation(JOIN_COMMUNITY);

    useEffect(() => {
        triggerJoin();
        // eslint-disable-next-line
    }, []);

    const triggerJoin = async () => {
        try {
            let result = await joinCommunity({
                variables: { code },
                refetchQueries: { query: MY_COMMUNITIES }
            });

            if (result.data.joinCommunity.success) {
                selectCommunity(result.data.joinCommunity.community.id);
            } else {
                throw new Error(result.data.joinCommunity.message);
            }
        } catch (err) {
            console.log(err.message);
        } finally {
            history.push('/');
        }
    };
    return null;
};

export default JoinCommunityLink;
