import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId;
    const variable = { videoId: videoId };
    const [videoDetail, setvideoDetail] = useState([]);
    const [Comments, setComments] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable).then((response) => {
            if (response.data.success) {
                console.log('비디오 상세정보 조회', response.data);
                setvideoDetail(response.data.videoDetail);
            } else {
                alert('비디오 정보 가져오기를 실패했습니다.');
            }
        });

        Axios.post('/api/comment/getComments', variable).then((response) => {
            if (response.data.success) {
                setComments(response.data.comments);
                console.log('댓글정보', response.data.comments);
            } else {
                alert('댓글 정보 가져오기를 실패 했습니다.');
            }
        });
    }, []);

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment));
    };

    if (videoDetail.writer) {
        const subscribeButton = videoDetail.writer._id !==
            localStorage.getItem('userId') && (
            <Subscribe userTo={videoDetail.writer._id} />
        );
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} controls>
                            <source
                                src={`http://localhost:5000/${videoDetail.filePath}`}
                            ></source>
                        </video>
                        <List.Item
                            actions={[
                                <LikeDislikes
                                    video
                                    userId={localStorage.getItem('userId')}
                                    videoId={videoId}
                                />,
                                subscribeButton,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar src={videoDetail.writer.image} />
                                }
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                            />
                        </List.Item>
                        {/* Comments Section*/}
                        <Comment
                            refreshFunction={refreshFunction}
                            commentLists={Comments}
                            postId={videoId}
                        />
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return <div>Now Loading...</div>;
    }
}

export default VideoDetailPage;
