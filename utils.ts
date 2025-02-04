export { formatCurrency, neverCall };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);

/**
 * Allows for strict pattern matching in switch-case and other conditional structures. If typescript is right, it should never be called in runtime, and only serves to give better typeErrors.
 *  Still, needs a fallback because typescript typesafety is a lie.
 */
const neverCall = <T>(e: never, fallback: T): T => fallback;
