import React from "react";
import { Navbar } from "./Navbar";
import { Session } from "next-auth";
import { Row } from "./layout";

export interface IHeaderProps {
  session: Session;
}
/** Basic Header component containing the BCGOV logo and title of the application. */
export const Header: React.FC<IHeaderProps> = ({ session }) => {
  return (
    <div className="w-full flex flex-col">
      <Row className="w-full bg-primaryBlue items-center px-4 text-white">
        <img
          className="h-[5rem] w-[12.5rem] mr-4"
          src="/bcgov_white_text.png"
          alt="BC GOV logo"
        />
        <span className="text-xl">Zero-Emission Vehicles Reporting System</span>
        <span className="ml-auto">Government of British Columbia</span>
      </Row>
      {session.user && <Navbar user={session.user} />}
    </div>
  );
};
