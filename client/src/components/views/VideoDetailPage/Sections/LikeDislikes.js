import React, { useEffect, useState } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0);
    const [Dislikes, setDislike] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [DislikeAction, setDislikeAction] = useState(null);
    let variable = {};

    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId };
    } else {
        variable = { commentId: props.commentId, userId: props.userId };
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable).then((response) => {
            if (response.data.success) {
                // 1. 해당 게시물이 받은 Like 개수
                setLikes(response.data.likes.length);

                // 2. 접속자가 Like를 눌렀는지에 대한 정보
                response.data.likes.map((like) => {
                    /* like.userId : 좋아요를 누른 유저중 한명, props.userId : 로그인중인 유저 */
                    if (like.userId === props.userId) {
                        setLikeAction('liked');
                    }
                });
            } else {
                alert('Likes에 대한 정보를 가져오지 못했습니다.');
            }
        });

        Axios.post('/api/like/getDislikes', variable).then((response) => {
            if (response.data.success) {
                // 1. 해당 게시물이 받은 Dislike 개수
                setDislike(response.data.dislikes.length);

                // 2. 접속자가 Dislike를 눌렀는지에 대한 정보
                response.data.dislikes.map((dislike) => {
                    /* dislike.userId : 싫어요를 누른 유저중 한명, props.userId : 로그인중인 유저 */
                    if (dislike.userId === props.userId) {
                        setDislikeAction('disliked');
                    }
                });
            } else {
                alert('Dislikes에 대한 정보를 가져오지 못했습니다.');
            }
        });
    }, []);

    const onLike = () => {
        if (LikeAction === null) {
            Axios.post('/api/like/upLike', variable).then((response) => {
                if (response.data.success) {
                    setLikes(Likes + 1);
                    setLikeAction('liked');
                    if (DislikeAction !== null) {
                        setDislikeAction(null);
                        setDislike(Dislikes - 1);
                    }
                } else {
                    alert('좋아요 올리기를 실패했습니다.');
                }
            });
        } else {
            Axios.post('/api/like/unLike', variable).then((response) => {
                if (response.data.success) {
                    setLikes(Likes - 1);
                    setLikeAction(null);
                } else {
                    alert('좋아요 내리기를 실패했습니다.');
                }
            });
        }
    };

    const onDislike = () => {
        if (DislikeAction !== null) {
            Axios.post('/api/like/unDislike', variable).then((response) => {
                if (response.data.success) {
                    setDislike(Dislikes - 1);
                    setDislikeAction(null);
                } else {
                    alert('싫어요 내리기를 실패했습니다.');
                }
            });
        } else {
            Axios.post('/api/like/upDislike', variable).then((response) => {
                if (response.data.success) {
                    setDislike(Dislikes + 1);
                    setDislikeAction('disliked');
                    if (LikeAction !== null) {
                        setLikes(Likes - 1);
                        setLikeAction(null);
                    }
                } else {
                    alert('싫어요 올리기를 실패했습니다.');
                }
            });
        }
    };
    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon
                        type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>
                    {Likes}
                </span>
            </span>
            <span key="comment-basic-like">
                <Tooltip title="Dislike">
                    <Icon
                        style={{ paddingLeft: '8px' }}
                        type="dislike"
                        theme={
                            DislikeAction === 'disliked' ? 'filled' : 'outlined'
                        }
                        onClick={onDislike}
                    />
                </Tooltip>
                <span
                    style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        cursor: 'auto',
                    }}
                >
                    {Dislikes}
                </span>
            </span>
        </div>
    );
}

export default LikeDislikes;
