function validateStrings(
  properties: (string | undefined)[],
): properties is string[] {
  if (properties) {
    for (const property of properties) {
      if (!property || typeof property !== "string") {
        return false;
      }
    }
  }
  return true;
}

export { validateStrings };
