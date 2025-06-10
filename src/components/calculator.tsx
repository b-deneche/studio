"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalculatorLogic } from "@/hooks/use-calculator-logic";

export function Calculator() {
  const {
    displayValue,
    handleDigitClick,
    handleOperatorClick,
    handleEqualsClick,
    handleDecimalClick,
    handleClearClick,
    handleMemoryClear,
    handleMemoryRecall,
    handleMemoryAdd,
    handleMemorySubtract,
    handleGrandTotalClear,
    handleGrandTotalRecall,
    memoryHasValue,
  } = useCalculatorLogic();

  const buttonBaseClass = "text-2xl font-medium h-16 w-full rounded-md shadow-sm active:shadow-inner";
  const primaryButtonClass = `bg-primary text-primary-foreground hover:bg-primary/90 ${buttonBaseClass}`;
  const accentButtonClass = `bg-accent text-accent-foreground hover:bg-accent/90 ${buttonBaseClass}`;
  const secondaryButtonClass = `bg-secondary text-secondary-foreground hover:bg-secondary/80 ${buttonBaseClass}`;

  const buttons = [
    { label: "MC", action: handleMemoryClear, style: accentButtonClass, type: "mem" },
    { label: "MR", action: handleMemoryRecall, style: accentButtonClass, type: "mem" },
    { label: "M-", action: handleMemorySubtract, style: accentButtonClass, type: "mem" },
    { label: "M+", action: handleMemoryAdd, style: accentButtonClass, type: "mem" },
    
    { label: "GT", action: handleGrandTotalRecall, style: accentButtonClass },
    { label: "GC", action: handleGrandTotalClear, style: accentButtonClass },
    { label: "C", action: handleClearClick, style: secondaryButtonClass },
    { label: "/", action: () => handleOperatorClick("/"), style: primaryButtonClass },

    { label: "7", action: () => handleDigitClick("7"), style: primaryButtonClass },
    { label: "8", action: () => handleDigitClick("8"), style: primaryButtonClass },
    { label: "9", action: () => handleDigitClick("9"), style: primaryButtonClass },
    { label: "*", action: () => handleOperatorClick("*"), style: primaryButtonClass },

    { label: "4", action: () => handleDigitClick("4"), style: primaryButtonClass },
    { label: "5", action: () => handleDigitClick("5"), style: primaryButtonClass },
    { label: "6", action: () => handleDigitClick("6"), style: primaryButtonClass },
    { label: "-", action: () => handleOperatorClick("-"), style: primaryButtonClass },

    { label: "1", action: () => handleDigitClick("1"), style: primaryButtonClass },
    { label: "2", action: () => handleDigitClick("2"), style: primaryButtonClass },
    { label: "3", action: () => handleDigitClick("3"), style: primaryButtonClass },
    { label: "+", action: () => handleOperatorClick("+"), style: primaryButtonClass },
    
    { label: "0", action: () => handleDigitClick("0"), style: `${primaryButtonClass} col-span-2` },
    { label: ".", action: handleDecimalClick, style: primaryButtonClass },
    { label: "=", action: handleEqualsClick, style: accentButtonClass },
  ];

  return (
    <Card className="w-full max-w-sm mx-auto shadow-xl border-2 border-primary/20 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="bg-muted text-accent text-right p-4 rounded-md h-24 flex flex-col justify-end items-end shadow-inner">
          {memoryHasValue && <div className="text-xs text-muted-foreground self-start">M</div>}
          <div className="text-5xl font-headline font-semibold break-all" title={displayValue}>
            {displayValue}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              onClick={btn.action}
              className={`${btn.style} ${btn.label === '0' ? 'col-span-2' : ''}`}
              aria-label={btn.label === "/" ? "Divide" : btn.label === "*" ? "Multiply" : btn.label === "-" ? "Subtract" : btn.label === "+" ? "Add" : btn.label === "=" ? "Equals" : btn.label}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
