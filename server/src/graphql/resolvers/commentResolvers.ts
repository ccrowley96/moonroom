import { mongooseId } from '../../controllers/utils';
import { User } from '../../db/index';

export default {
    author: async (comment) => {
        let author = await User.findById({ _id: mongooseId(comment.author) });
        return author;
    }
};
