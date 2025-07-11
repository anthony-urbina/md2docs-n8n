import { Paragraph, LineRuleType } from "docx";

export const getDocConfig = (children: Paragraph[]) => {
  const config = {
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 24,
          },
        },
        heading1: {
          run: {
            size: 32,
            bold: true,
            color: "000000",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              before: 200,
              after: 100,
              line: 300,
              lineRule: LineRuleType.AUTO,
            },
          },
        },
        heading2: {
          run: {
            size: 28,
            bold: true,
            color: "000000",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              before: 160,
              after: 80,
              line: 300,
              lineRule: LineRuleType.AUTO,
            },
          },
        },
        heading3: {
          run: {
            size: 24,
            bold: true,
            color: "000000",
            font: "Arial",
          },
          paragraph: {
            spacing: {
              before: 120,
              after: 60,
              line: 300,
              lineRule: LineRuleType.AUTO,
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: "codeStyle",
          name: "Code Style",
          basedOn: "Normal",
          run: {
            font: "Courier New",
            size: 20,
          },
          paragraph: {
            spacing: {
              before: 80,
              after: 80,
              line: 300,
              lineRule: LineRuleType.AUTO,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  };

  return config;
};
