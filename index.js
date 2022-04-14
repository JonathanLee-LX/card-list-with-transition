import React, {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  Fragment,
} from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Card, Avatar, Button } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const { Meta } = Card;

function App() {
  // const refs = useRef([]);
  const cardListRef = useRef(null);

  const [list, setList] = useState(new Array(1).fill(0));

  const handleAdd = () => {
    setList((prevList) => [...prevList, prevList.length]);
  };

  const [rects, setRects] = useState([]);

  const getOffsetTop = useCallback(
    (i) => {
      let offsetTop = 0;

      while (i > 0) {
        // 10 as marginBottom
        i -= 1;
        const { top, height } = rects[i] ?? { top: 0, height: 0 };
        offsetTop = offsetTop + top + height;
      }

      return offsetTop;
    },
    [rects]
  );

  useEffect(() => {
    const ob = new ResizeObserver(function cb(entries) {
      for (let entry of entries) {
        console.log(entry);
      }
    });
    ob.observe(cardListRef.current);
  }, []);

  // useLayoutEffect(() => {
  //   const id = setInterval(() => {
  //     for (let i = 0; i < refs.current.length; i++) {
  //       const rect = refs.current[i].getBoundingClientRect();
  //       console.log('2000ms later', rect);
  //       setRects((rects) => {
  //         const _rects = rects.slice();
  //         _rects[i] = rect;
  //         return _rects;
  //       });
  //     }
  //   }, 2000);

  //   return () => {
  //     clearInterval(id);
  //   };
  // }, [refs.current.length]);

  console.log(rects);

  function getOffsetLeft(status) {
    let x, opacity;

    switch (status) {
      case 'entering':
        x = -30;
        opacity = '0';
        break;
      case 'entered':
        x = 0;
        opacity = '1';
        break;
      case 'exited':
        x = 30;
        opacity = '0';
        break;
      case 'exiting':
        x = 0;
        opacity = '1';
        break;
      case 'unmounted':
        break;
      default:
        break;
    }

    return x;
  }

  return (
    <>
      <Button className="add-btn" onClick={handleAdd}>
        Add Card
      </Button>
      <div className="card-list-wrap" ref={cardListRef}>
        <TransitionGroup component={Fragment}>
          {list.map((_, i) => (
            <CSSTransition key={i} timeout={500} classNames="card">
              {(status) => (
                <Card
                  // ref={(node) => {
                  //   if (node) {
                  //     refs.current[i] = node;
                  //   }
                  // }}
                  style={{
                    width: 300,
                    marginBottom: 10,
                    position: 'absolute',
                    transform: `translate(${getOffsetLeft(
                      status
                    )}px, ${getOffsetTop(i)}px)`,
                  }}
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
                  actions={
                    i % 2 === 0
                      ? [
                          <SettingOutlined key="setting" />,
                          <EditOutlined key="edit" />,
                          <EllipsisOutlined key="ellipsis" />,
                        ]
                      : []
                  }
                >
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title="Card title"
                    description="This is the description"
                  />
                </Card>
              )}
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('container'));
