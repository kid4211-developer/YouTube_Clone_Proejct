import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import { Input } from 'antd';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;

function Comment(props) {
    const user = useSelector((state) => state.user);
    const [commentValue, setcommentValue] = useState('');
    const videoId = props.postId;

    const handleClick = (e) => {
        setcommentValue(e.currentTarget.value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId,
        };
        Axios.post('/api/comment/saveComment', variables).then((response) => {
            if (response.data.success) {
                console.log('댓글 작성', response.data.result);
                setcommentValue('');
                props.refreshFunction(response.data.result);
            } else {
                alert('댓글 작성을 실패 하였습니다.');
            }
        });
    };
    return (
        <div>
            <br />
            <p>Replies</p>

            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={commentValue}
                    placeholder="댓글 내용을 작정해 주세요."
                />
                <br />
                <button
                    style={{ width: '20%', height: '52px' }}
                    onClick={onSubmit}
                >
                    Submit
                </button>
            </form>
            <hr />
            {props.commentLists &&
                props.commentLists.map(
                    (comment, index) =>
                        !comment.responseTo && (
                            <div key={index}>
                                <SingleComment
                                    comment={comment}
                                    postId={videoId}
                                    refreshFunction={props.refreshFunction}
                                />
                                <ReplyComment
                                    parentCommentId={comment._id}
                                    postId={videoId}
                                    commentLists={props.commentLists}
                                    refreshFunction={props.refreshFunction}
                                />
                            </div>
                        )
                )}
        </div>
    );
}

export default Comment;
