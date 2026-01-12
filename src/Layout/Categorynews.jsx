import React, { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router';
import Newscard from '../Components/Newscard/Newscard';

const Categorynews = () => {
    const { id } = useParams();
    const news = useLoaderData();
    const [shownews, setShownews] = useState([]);

    useEffect(() => {
        if (id == '0') {
            setShownews(news)
            return;
        }
        else if(id == '1'){
           const filternews = news.filter(newsf => newsf.others?.is_today_pick == true)
        setShownews(filternews)
        } else{
             const filternews = news.filter(newsf => newsf.category_id == id)
        setShownews(filternews)
        }
       
    }, [news, id])

    return (
        <div>
            <h1> All Newses</h1>

            <div className='grid grid-cols-1'>
                {
                    shownews.map(niws => <Newscard id={niws.id} niws={niws}></Newscard>)
                }
            </div>
        </div>
    );
};

export default Categorynews;