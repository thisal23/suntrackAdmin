import React from "react";
import apiService from "../../config/axiosConfig";
import { FaChevronCircleRight } from "react-icons/fa";
import NavBar from "../../components/NavBar/NavBar";
import InfoCard from "./InfoCard";

const Dashboard = () => {
  return (
    <div>
      <NavBar />
      <div className="container_custom mt-5 mx-auto flex flex-row justify-center gap-4 pt-20 pb-19 items-start h-auto">
        <InfoCard
          CardName="Vehicles"
          count_name_1="Total"
          count_name_2="Available"
          count_name_3="Out of Service"
          count_1="2"
          count_2="1"
          count_3="3"
          //   count_1={fetchVehicleCount.total}
          //   count_2={fetchVehicleCount.available}
          //   count_3={fetchVehicleCount.outofservice}
        />
        <InfoCard
          CardName="Drivers"
          count_name_1="Total"
          count_name_2="Available"
          count_name_3="Out of Service"
          count_1="100"
          count_2="20"
          count_3="13"
        />
        <InfoCard
          CardName="Trips"
          count_name_1="Pending"
          count_name_2="Live"
          count_name_3="Finished"
          count_1="4"
          count_2="5"
          count_3="6"
        />
      </div>
    </div>
  );
};

export default Dashboard;
