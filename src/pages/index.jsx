import { openMiniApp } from "zmp-sdk";
import { Box, Button, Icon, Page, Text } from "zmp-ui";

import Clock from "../components/clock";
import Logo from "../components/logo";
import bg from "../static/bg.svg";

import React, { useState } from "react";
import Calculator from "./calculator";

function HomePage() {
  const [showCalculator, setShowCalculator] = useState(false);

  if (showCalculator) {
    return <Calculator />;
  }

  return (
    <Page className="p-4 flex flex-col items-center space-y-4">
      <Text.Title>Home Page</Text.Title>

      <Button
        variant="primary"
        onClick={() => setShowCalculator(true)}
      >
        Mở Calculator
      </Button>
    </Page>
  );
}

export default HomePage;
