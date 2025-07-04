"use client";
import { Badge } from "@nextui-org/badge";
import { Input } from "@nextui-org/input";
import { Navbar, NavbarContent } from "@nextui-org/navbar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import Link from "next/link";
import { FaMessage } from "react-icons/fa6";
import { SearchIcon } from "../icons";
import FeedbackIcon from "../icons/feed-back-icon";
import Notifications from "../notifications/notifications";

const Header = () => {
  return (
    <Navbar
      isBordered
      maxWidth="full"
      className="w-full flex items-center !justify-start"
    >
      <div className="flex items-center justify-between w-full gap-4">
        <NavbarContent className="w-full">
          <Input
            isClearable
            startContent={<SearchIcon color="#697177" />}
            placeholder="Search..."
            className="w-full"
          />
        </NavbarContent>
        <div className="flex items-center gap-6 ml-2">
          <NavbarContent className="cursor-pointer">
            <div className="flex items-center gap-1">
              <FeedbackIcon />
              <span>Feedback?</span>
            </div>
          </NavbarContent>
          <NavbarContent>
            <Notifications />
          </NavbarContent>
          <NavbarContent>
            <Link
              href={"/support-center"}
              className="flex items-center cursor-pointer"
            >
              <Badge color="danger" content="3">
                <FaMessage color="#687176" size={17} />
              </Badge>
            </Link>
          </NavbarContent>
          <NavbarContent>
            <Dropdown placement="bottom-end">
              <DropdownTrigger className="flex items-center gap-4">
                <User
                  as="button"
                  className="transition-transform w-[150px]"
                  avatarProps={{
                    isBordered: true,
                    src: "/10.jpg",
                  }}
                  description="@avashnepal"
                  name="Avash"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="gap-2 h-14">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">shahriar@becodemy.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
