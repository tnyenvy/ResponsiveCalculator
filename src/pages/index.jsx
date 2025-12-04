import { openMiniApp } from "zmp-sdk";
import { Box, Button, Icon, Page, Text } from "zmp-ui";

import React, { useState } from "react";
import Calculator from "./calculator";

function HomePage() {
  const [showCalculator, setShowCalculator] = useState(false);

  if (showCalculator) {
    return <Calculator />;
  }

  return (
    <Page className="p-4 flex flex-col items-center space-y-4">
      <Text.Title>Zalo Mini Calculator</Text.Title>
      <Button
      className="btn-launch-calc" 
      onClick={() => setShowCalculator(true)}>
        Calculator
      </Button>
    </Page>
  );
}

export default HomePage;
