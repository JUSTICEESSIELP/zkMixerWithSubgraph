"use-client";

import React from "react";
import Banaman from "@/public/banaman.jpg";
import Image from "next/image";

const Images = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <Image src={Banaman} width={200} height={200} />
      <Image
        src={
          "https://plus.unsplash.com/premium_photo-1664361480105-33afc4559c40?q=80&w=1846&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        width={650}
        height={355}
      />
    </div>
  );
};

export default Images;
