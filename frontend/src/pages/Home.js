import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      {/*<HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}/>
      <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/> */}

      <VerticalCardProduct category={"NamePlates"} heading={"Name Plates"}/>
      <VerticalCardProduct category={"NeonLightsSign"} heading={"Neon Lights Sign"}/>
      <VerticalCardProduct category={"Metal Letters"} heading={"Metal Letters"}/>
      
    </div>
  )
}

export default Home