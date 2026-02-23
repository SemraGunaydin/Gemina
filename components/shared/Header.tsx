import React from "react";

const Header = ({ title, subTitle }: { title: string; subTitle?: string }) => {
  return (
    <>
      <h2 className="h2-bold text-dark-600">{title}</h2>
      {subTitle && <p className="p-regular text-dark-400">{subTitle}</p>}
    </>
  );
};

export default Header;
