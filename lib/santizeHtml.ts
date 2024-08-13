import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const sanitizeHtml = (html: string) => {
  return DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(html);
};

export default sanitizeHtml;
