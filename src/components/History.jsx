import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import VideoCard from './VideoCard';
import { getHistory } from '../redux/historySlice';
import timeSince from '../utils/date';
import './Sidebar'; // For potential sidebar extend

function History() {
  const dispatch = useDispatch();
// const navigate = useNavigate();
  const { history, isLoading } = useSelector((state) => state.history);
  const { sidebarExtend } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getHistory());
  }, [dispatch]);

  if (isLoading) return <div className="pt-20 pl-4 text-xl">Loading history...</div>;

  return (
    <>
      <div className={`sm:hidden overlayEffect ${sidebarExtend ? "block" : "hidden"}`}></div>
      <div className={`pl-0 ${sidebarExtend ? "sm:pl-[180px]" : "sm:pl-[70px]"} pt-20 mx-3 sm:ml-4 md:pr-[28px] lg:pr-14 feedGrid grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-[4%] gap-y-6 max-w-[100%]`}>
        {history.length === 0 ? (
          <div className="col-span-full text-center pt-10 text-xl text-gray-500">No watch history yet.</div>
        ) : (
          history.map((item, index) => (
            <div key={index}>
              <VideoCard
                title={item.title}
                videoId={item.videoId}
                channel="History" // Placeholder
                on={timeSince(new Date(item.timestamp))}
                thumbnail={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`} // Default thumbnail
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default History;
