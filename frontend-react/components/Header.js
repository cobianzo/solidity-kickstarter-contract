import React from "react";
import { Menu, Segment, Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

function Header() {
  const activeItem = "home";
  const router = useRouter();

  const handleItemClick = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <Menu pointing>
        <Link href="/">
          <Menu.Item name="home" active={activeItem === "home"} />
        </Link>
        <Link href="/">
          <Menu.Item name="messages" active={activeItem === "messages"} />
        </Link>
        <Link href="/">
          <Menu.Item name="friends" active={activeItem === "friends"} />
        </Link>
        <Menu.Menu position="right">
          <Link href="/campaigns/new">
            <Menu.Item
              name="new_campaign"
              active={activeItem === "new_campaign"}
            />
          </Link>
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Segment></Segment>
    </>
  );
}

export default Header;
