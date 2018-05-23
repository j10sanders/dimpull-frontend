import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import { Link } from 'react-router-dom';

export default function DefaultProfiles () {
  const dps = [
    {
      id: 1, url: 'tlc', first_name: 'Toni', last_name: 'Lane', description: 'Founder @ Cultu.re / Co-founder @ CoinTelegraph | Blockchain Pioneer | Entrepreneur | Investor | Empath | Board Member | Transformational Evangelist | Happy Lady.', image: 'https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,f_auto,h_595,q_auto:eco/v1523635339/experts/sdo9fgjmzhsjvm2xyqhm.jpg'
    },
    {
      id: 2, url: 'ben-way', first_name: 'Ben', last_name: 'Way', description: 'Crypto/ICO expert with extensive technical background', image: 'https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_595/v1523898203/experts/byfzhf14drmapbugfq7n.png'
    },
    {
      id: 3, url: 'baselismail', first_name: 'Basel', last_name: 'Ismail', description: 'Co-Founder and CEO of Blockgram; Blockchain Technology and Cryptocurrencies; Data Scientist', image: 'https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_595/v1523895908/experts/abjd6gteupdspx5t22dg.jpg'
    },
    // {
    //   id: 4, url: 'nikhilwins', first_name: 'Nikhil', last_name: 'Bhaskar', description: 'Founder & CEO of Ulixir Inc', image: 'https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_595/v1525173789/experts/zpgc4a6ggaocwffdjeue.jpg'
    // },
    {
      id: 4, url: 'zb', first_name: 'Zach', last_name: 'Burks', description: 'CTO Harvest.Networks, Dapp Developer, full-time trader', image: 'https://res.cloudinary.com/dtvc9q04c/image/upload/c_scale,h_595/v1524000202/experts/ndq8b8oyjeuwd7sbd58k.jpg'
    }
  ];
  return (
    <GridList
      id="GridlistID"
      cols={2}
      padding={20}
      cellHeight={220}
    >
      {dps.map(dp => (
        <Link to={`/expert/${dp.url}`} key={dp.url}>
          <GridTile
            key={dp.id}
            title={<span><b>{`${dp.first_name} ${dp.last_name}`}</b></span>}
            subtitle={dp.description}
          >
            <img src={dp.image} alt={dp.id} />
          </GridTile>
        </Link>
      ))}
    </GridList>
  );
}
