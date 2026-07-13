import { describe, expect, it } from "vite-plus/test";
import {
  isClientRule,
  parseRuleAttr,
  validateField,
  type ParsedRule,
} from "../src/client/rules.ts";

function rules(...entries: Array<string | [string, string]>): ParsedRule[] {
  return entries.map((entry) => {
    const [attr, message] = typeof entry === "string" ? [entry, ""] : entry;
    const parsed = parseRuleAttr(`sf-validate:${attr}`, message);
    if (!parsed) throw new Error(`Bad rule: ${attr}`);
    return parsed;
  });
}

function check(value: string | string[], ruleList: ParsedRule[], values = {}) {
  return validateField("field", value, ruleList, values);
}

describe("parseRuleAttr", () => {
  it("parses simple rules", () => {
    expect(parseRuleAttr("sf-validate:required", "")).toEqual({
      name: "required",
      param: null,
      message: null,
    });
  });

  it("parses parameterized rules with custom messages", () => {
    expect(parseRuleAttr("sf-validate:min_length[3]", "Too short")).toEqual({
      name: "min_length",
      param: "3",
      message: "Too short",
    });
  });

  it("ignores non-validation attributes", () => {
    expect(parseRuleAttr("class", "foo")).toBeNull();
    expect(parseRuleAttr("if-error", "email")).toBeNull();
  });
});

describe("isClientRule", () => {
  it("accepts client-checkable rules", () => {
    expect(isClientRule("required")).toBe(true);
    expect(isClientRule("email")).toBe(true);
    expect(isClientRule("between")).toBe(true);
  });

  it("rejects server-only and unknown rules", () => {
    expect(isClientRule("active_url")).toBe(false);
    expect(isClientRule("not_a_rule")).toBe(false);
  });
});

describe("required", () => {
  it("fails on empty values", () => {
    expect(check("", rules("required"))).toContain("required");
    expect(check("  ", rules("required"))).toContain("required");
    expect(check([], rules("required"))).toContain("required");
  });

  it("passes on non-empty values", () => {
    expect(check("hi", rules("required"))).toBeNull();
    expect(check(["a"], rules("required"))).toBeNull();
  });

  it("uses the custom message when provided", () => {
    expect(check("", rules(["required", "Name it!"]))).toBe("Name it!");
  });
});

describe("optional empty values", () => {
  it("skips non-required rules when empty", () => {
    expect(check("", rules("email", "min_length[5]", "numeric"))).toBeNull();
  });

  it("still fails accepted when empty", () => {
    expect(check("", rules("accepted"))).toContain("accepted");
  });
});

describe("format rules", () => {
  it("email", () => {
    expect(check("a@b.co", rules("email"))).toBeNull();
    expect(check("nope", rules("email"))).not.toBeNull();
  });

  it("url requires http(s)", () => {
    expect(check("https://example.com", rules("url"))).toBeNull();
    expect(check("ftp://example.com", rules("url"))).not.toBeNull();
    expect(check("example.com", rules("url"))).not.toBeNull();
  });

  it("boolean and accepted", () => {
    expect(check("true", rules("boolean"))).toBeNull();
    expect(check("2", rules("boolean"))).not.toBeNull();
    expect(check("on", rules("accepted"))).toBeNull();
    expect(check("no", rules("accepted"))).not.toBeNull();
  });

  it("numeric and integer", () => {
    expect(check("1.5", rules("numeric"))).toBeNull();
    expect(check("0.5", rules("numeric"))).toBeNull();
    expect(check("abc", rules("numeric"))).not.toBeNull();
    expect(check("-3", rules("integer"))).toBeNull();
    expect(check("1.5", rules("integer"))).not.toBeNull();
  });

  it("alpha family", () => {
    expect(check("abc", rules("alpha"))).toBeNull();
    expect(check("ab1", rules("alpha"))).not.toBeNull();
    expect(check("ab1", rules("alpha_num"))).toBeNull();
    expect(check("a-b_1", rules("alpha_dash"))).toBeNull();
    expect(check("a b", rules("alpha_dash"))).not.toBeNull();
  });

  it("ip, ipv4, ipv6, uuid", () => {
    expect(check("192.168.0.1", rules("ipv4"))).toBeNull();
    expect(check("999.0.0.1", rules("ipv4"))).not.toBeNull();
    expect(check("::1", rules("ipv6"))).toBeNull();
    expect(check("192.168.0.1", rules("ip"))).toBeNull();
    expect(check("::1", rules("ip"))).toBeNull();
    expect(check("550e8400-e29b-41d4-a716-446655440000", rules("uuid"))).toBeNull();
    expect(check("not-a-uuid", rules("uuid"))).not.toBeNull();
  });
});

describe("number rules", () => {
  it("min, max, between compare numerically", () => {
    expect(check("5", rules("min[3]"))).toBeNull();
    expect(check("2", rules("min[3]"))).not.toBeNull();
    expect(check("5", rules("max[10]"))).toBeNull();
    expect(check("11", rules("max[10]"))).not.toBeNull();
    expect(check("5", rules("between[1,10]"))).toBeNull();
    expect(check("11", rules("between[1,10]"))).not.toBeNull();
  });

  it("non-numeric values fail number rules", () => {
    expect(check("abc", rules("min[3]"))).not.toBeNull();
  });
});

describe("string rules", () => {
  it("length rules", () => {
    expect(check("abc", rules("min_length[3]"))).toBeNull();
    expect(check("ab", rules("min_length[3]"))).not.toBeNull();
    expect(check("abc", rules("max_length[3]"))).toBeNull();
    expect(check("abcd", rules("max_length[3]"))).not.toBeNull();
  });

  it("starts_with / ends_with accept comma lists", () => {
    expect(check("foobar", rules("starts_with[foo,baz]"))).toBeNull();
    expect(check("quux", rules("starts_with[foo,baz]"))).not.toBeNull();
    expect(check("foobar", rules("ends_with[bar]"))).toBeNull();
    expect(check("foobar", rules("doesnt_start_with[foo]"))).not.toBeNull();
    expect(check("foobar", rules("doesnt_end_with[baz]"))).toBeNull();
  });

  it("in / not_in", () => {
    expect(check("a", rules("in[a,b,c]"))).toBeNull();
    expect(check("d", rules("in[a,b,c]"))).not.toBeNull();
    expect(check("d", rules("not_in[a,b,c]"))).toBeNull();
    expect(check("a", rules("not_in[a,b,c]"))).not.toBeNull();
  });
});

describe("date rules", () => {
  it("date format", () => {
    expect(check("2020-01-01", rules("date"))).toBeNull();
    expect(check("2020-01-01 12:00:00", rules("date"))).toBeNull();
    expect(check("01/01/2020", rules("date"))).not.toBeNull();
  });

  it("after / before with date literals", () => {
    expect(check("2020-06-01", rules("after[2020-01-01]"))).toBeNull();
    expect(check("2019-06-01", rules("after[2020-01-01]"))).not.toBeNull();
    expect(check("2019-06-01", rules("before[2020-01-01]"))).toBeNull();
  });

  it("after / before with keywords", () => {
    expect(check("2099-01-01", rules("after[today]"))).toBeNull();
    expect(check("2000-01-01", rules("after[today]"))).not.toBeNull();
    expect(check("2000-01-01", rules("before[yesterday]"))).toBeNull();
  });

  it("date comparisons against another field", () => {
    const values = { start: "2020-01-01" };
    expect(check("2020-06-01", rules("after[start]"), values)).toBeNull();
    expect(check("2019-06-01", rules("after[start]"), values)).not.toBeNull();
  });

  it("or_equal and date_equals", () => {
    expect(check("2020-01-01", rules("after_or_equal[2020-01-01]"))).toBeNull();
    expect(check("2020-01-01", rules("before_or_equal[2020-01-01]"))).toBeNull();
    expect(check("2020-01-01", rules("date_equals[2020-01-01]"))).toBeNull();
    expect(check("2020-01-02", rules("date_equals[2020-01-01]"))).not.toBeNull();
  });
});

describe("comparative rules", () => {
  it("same / different", () => {
    const values = { password: "secret" };
    expect(check("secret", rules("same[password]"), values)).toBeNull();
    expect(check("other", rules("same[password]"), values)).not.toBeNull();
    expect(check("other", rules("different[password]"), values)).toBeNull();
    expect(check("secret", rules("different[password]"), values)).not.toBeNull();
  });

  it("gt/gte/lt/lte compare numerically when both numeric", () => {
    const values = { min_price: "10" };
    expect(check("11", rules("gt[min_price]"), values)).toBeNull();
    expect(check("9", rules("gt[min_price]"), values)).not.toBeNull();
    expect(check("10", rules("gte[min_price]"), values)).toBeNull();
    expect(check("9", rules("lt[min_price]"), values)).toBeNull();
    expect(check("10", rules("lte[min_price]"), values)).toBeNull();
  });

  it("gt/gte/lt/lte compare by length for text", () => {
    const values = { short: "ab" };
    expect(check("abc", rules("gt[short]"), values)).toBeNull();
    expect(check("a", rules("gt[short]"), values)).not.toBeNull();
  });
});

describe("rule ordering and skipping", () => {
  it("returns the first failing rule's message", () => {
    const result = check("x", rules(["min_length[3]", "Too short"], ["alpha_num", "Bad chars"]));
    expect(result).toBe("Too short");
  });

  it("skips server-only rules", () => {
    expect(check("https://example.com", rules("active_url"))).toBeNull();
  });

  it("validates every item of a checkbox group", () => {
    expect(check(["a", "b"], rules("in[a,b,c]"))).toBeNull();
    expect(check(["a", "d"], rules("in[a,b,c]"))).not.toBeNull();
  });

  it("auto-generates a humanized message", () => {
    expect(validateField("first_name", "", rules("required"), {})).toBe(
      "The first name field is required.",
    );
  });
});
