"use client";

import Link from "next/link";

import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import {
  homeItems,
  servicesItems,
  blogItems,
  pageItems,
  dashboardItems,
} from "../../data/mainMenuData";
import {
  isActiveLink,
} from "../../utils/linkActiveChecker";
import Social from "../common/social/Social";
import ContactInfo from "./ContactInfo";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MobileMenu = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="pro-header d-flex align-items-center justify-between border-bottom-light">
        <Link href="/">
          <img src="/img/general/logo-dark.svg" alt="brand" />
        </Link>
        {/* End logo */}

        <div
          className="fix-icon"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="icon icon-close"></i>
        </div>
        {/* icon close */}
      </div>
      {/* End pro-header */}

      <Sidebar width="400" backgroundColor="#fff">
        <Menu>
          {/* Home */}
          <MenuItem
            onClick={() => router.push("/")}
            className={pathname === "/" ? "menu-active-link" : ""}
          >
            <i className="icon-home mr-10" />
            Home
          </MenuItem>

          {/* Services - Simple List */}
          <SubMenu 
            label="Services" 
            className={servicesItems.some(item => item.routePath?.split('/')[1] === pathname.split('/')[1]) ? "menu-active-link" : ""}
          >
            {servicesItems.map((item, i) => (
              <MenuItem
                key={i}
                onClick={() => router.push(item.routePath)}
                className={
                  isActiveLink(item.routePath, pathname)
                    ? "menu-active-link"
                    : "inactive-menu"
                }
              >
                <i className={`${item.icon} mr-10`} />
                {item.name}
              </MenuItem>
            ))}
          </SubMenu>

          {/* Destinations */}
          <MenuItem
            onClick={() => router.push("/destinations")}
            className={pathname === "/destinations" ? "menu-active-link" : ""}
          >
            <i className="icon-map mr-10" />
            Destinations
          </MenuItem>

          {/* Blog */}
          <SubMenu 
            label="Blog" 
            className={blogItems.some(item => item.routePath?.split('/')[1] === pathname.split('/')[1]) ? "menu-active-link" : ""}
          >
            {blogItems.map((item, i) => (
              <MenuItem
                key={i}
                onClick={() => router.push(item.routePath)}
                className={
                  isActiveLink(item.routePath, pathname)
                    ? "menu-active-link"
                    : "inactive-menu"
                }
              >
                <i className="icon-blog mr-10" />
                {item.name}
              </MenuItem>
            ))}
          </SubMenu>

          {/* Pages */}
          <SubMenu 
            label="Pages" 
            className={pageItems.some(item => item.routePath?.split('/')[1] === pathname.split('/')[1]) ? "menu-active-link" : ""}
          >
            {pageItems.map((item, i) => (
              <MenuItem
                key={i}
                onClick={() => router.push(item.routePath)}
                className={
                  isActiveLink(item.routePath, pathname)
                    ? "menu-active-link"
                    : "inactive-menu"
                }
              >
                {item.name}
              </MenuItem>
            ))}
          </SubMenu>

          {/* Dashboard */}
          <SubMenu 
            label="Dashboard" 
            className={pathname.split('/')[1] === 'dashboard' ? "menu-active-link" : ""}
          >
            {dashboardItems.map((item, i) => (
              <MenuItem
                key={i}
                onClick={() => router.push(item.routePath)}
                className={
                  isActiveLink(item.routePath, pathname)
                    ? "menu-active-link"
                    : "inactive-menu"
                }
              >
                {item.name}
              </MenuItem>
            ))}
          </SubMenu>
        </Menu>
      </Sidebar>

      <div className="mobile-footer px-20 py-5 border-top-light"></div>

      <div className="pro-footer">
        <ContactInfo />
        <div className="mt-10">
          <h5 className="text-16 fw-500 mb-10">Follow us on social media</h5>
          <div className="d-flex x-gap-20 items-center">
            <Social />
          </div>
        </div>
        <div className="mt-20">
          <Link
            className="button -dark-1 px-30 fw-400 text-14 bg-blue-1 h-50 text-white"
            href="/login"
          >
            Become An Expert
          </Link>
        </div>
      </div>
      {/* End pro-footer */}
    </>
  );
};

export default MobileMenu;
