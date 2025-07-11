export function stripMarkdownCodeBlock(content: string): string {
  if (content.startsWith("```markdown\n") && content.endsWith("```")) {
    return content.slice("```markdown\n".length, -3);
  } else if (content.startsWith("```\n") && content.endsWith("```")) {
    return content.slice("```\n".length, -3);
  }
  return content;
}
