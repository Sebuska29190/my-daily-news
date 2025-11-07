import React, { use } from 'react';
import { NavLink } from 'react-router';

const categorypromie = fetch("/categories.json")
    .then(res => res.json())

const Categories = () => {
    const cat = use(categorypromie)

    return (
        <div>
            <h1>All Category  </h1>
            <div className='grid grid-cols-1 mt-5'>
                {
                    cat.map(category => <NavLink key={category.id} className='btn mt-2 bg-base-100 border-0 hover:bg-base-200' to={`/category/${category.id}`} >{category.name}</NavLink>)
                }
            </div>
        </div>
    );
};

export default Categories;