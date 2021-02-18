import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscribe(props) {
    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);
    useEffect(() => {
        let variable = { userTo: props.userTo };
        Axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
            if (response.data.success) {
                console.log('구독자수 조회', response.data);
                setSubscribeNumber(response.data.subscribeNumber);
            } else {
                alert('구독자 수 정보 조회를 실패했습니다.');
            }
        });

        let subscribedVariables = { userTo: props.userTo, userFrom: localStorage.getItem('userId') };
        Axios.post('/api/subscribe/subscribed', subscribedVariables).then((response) => {
            if (response.data.success) {
                console.log('구독자 정보 조회', response.data.subscribed);
                setSubscribed(response.data.subscribed);
            } else {
                alert('구독자 정보 조회를 실패했습니다.');
            }
        });
    }, []);

    const onSubscribe = () => {
        let subscribedVariables = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId'),
        };

        if (Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribedVariables).then((response) => {
                if (response.data.success) {
                    setSubscribeNumber(SubscribeNumber - 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('구독취소를 실패 했습니다.');
                }
            });
        } else {
            Axios.post('/api/subscribe/subscribe', subscribedVariables).then((response) => {
                if (response.data.success) {
                    setSubscribeNumber(SubscribeNumber + 1);
                    setSubscribed(!Subscribed);
                } else {
                    alert('구독을 실패 했습니다.');
                }
            });
        }
    };

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                    borderRadius: '4px',
                    color: 'white',
                    padding: '10px 16px',
                    fontWeight: '500',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
    );
}

export default Subscribe;
