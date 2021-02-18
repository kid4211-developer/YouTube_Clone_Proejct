import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector((state) => state.user);
    const [OpenReply, setOpenReply] = useState(false);
    const [commentValue, setcommentValue] = useState('');
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    };
    const onHandleChange = (e) => {
        setcommentValue(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
        };

        Axios.post('/api/comment/saveComment', variables).then((response) => {
            if (response.data.success) {
                console.log('대댓글 작성', response.data.result);
                setcommentValue('');
                setOpenReply(false);
                props.refreshFunction(response.data.result);
            } else {
                alert('대댓글 작성을 실패 하였습니다.');
            }
        });
    };
    const actions = [
        <LikeDislikes
            userId={localStorage.getItem('userId')}
            commentId={props.comment._id}
        />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
            Reply to
        </span>,
    ];

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={
                    <Avatar src={props.comment.writer.image} alt="userImage" />
                }
                content={<p>{props.comment.content}</p>}
            />
            {OpenReply && (
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        placeholder="댓글 내용을 작정해 주세요."
                        onChange={onHandleChange}
                        value={commentValue}
                    />
                    <br />
                    <button
                        style={{ width: '20%', height: '52px' }}
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
}

export default SingleComment;
