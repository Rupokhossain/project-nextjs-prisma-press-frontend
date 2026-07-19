import { Button } from "@/components/ui/button";
import { getMe } from "@/service/getMe";
import React from "react";

const HomePage = async () => {

  const user = await getMe();

  console.log(user)

  return (
    <div>
      hello next js
      <Button size={"xs"} variant={"destructive"}>
        Click Me
      </Button>
    </div>
  );
};

export default HomePage;
