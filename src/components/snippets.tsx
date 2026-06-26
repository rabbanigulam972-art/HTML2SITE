import type { ComponentType, SVGProps } from "react";
import {
  Heading,
  ImageIcon,
  Layers,
  Link2,
  ListIcon,
  Minus,
  MousePointer,
  Square,
  TableIcon,
  TextInput,
} from "./icons";

export interface Snippet {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  code: string;
}

export const SNIPPETS: Snippet[] = [
  {
    id: "button",
    label: "Button",
    icon: MousePointer,
    code: `<button type="button" style="padding:10px 20px;border:none;border-radius:8px;background:#6366f1;color:#fff;font-size:15px;cursor:pointer">Click me</button>`,
  },
  {
    id: "section",
    label: "Section",
    icon: Layers,
    code: `<section style="padding:24px;border:1px solid #e5e7eb;border-radius:12px;margin:16px 0">
  <h2>New Section</h2>
  <p>Describe this part of your page here.</p>
</section>`,
  },
  {
    id: "heading",
    label: "Heading",
    icon: Heading,
    code: `<h1>Your Heading</h1>`,
  },
  {
    id: "paragraph",
    label: "Text",
    icon: TextInput,
    code: `<p>Write your paragraph text here. You can edit it freely.</p>`,
  },
  {
    id: "image",
    label: "Image",
    icon: ImageIcon,
    code: `<img src="https://picsum.photos/600/300" alt="Description" style="max-width:100%;border-radius:12px" />`,
  },
  {
    id: "link",
    label: "Link",
    icon: Link2,
    code: `<a href="https://example.com" target="_blank" rel="noreferrer">Link text</a>`,
  },
  {
    id: "list",
    label: "List",
    icon: ListIcon,
    code: `<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>`,
  },
  {
    id: "input",
    label: "Input",
    icon: Square,
    code: `<input type="text" placeholder="Enter text..." style="padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;width:100%" />`,
  },
  {
    id: "card",
    label: "Card",
    icon: Square,
    code: `<div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;max-width:320px;box-shadow:0 4px 12px rgba(0,0,0,.06)">
  <h3 style="margin-top:0">Card title</h3>
  <p style="margin-bottom:0">Card content goes here. Add anything you like.</p>
</div>`,
  },
  {
    id: "table",
    label: "Table",
    icon: TableIcon,
    code: `<table style="width:100%;border-collapse:collapse">
  <tr>
    <th style="border:1px solid #ddd;padding:8px;text-align:left">Name</th>
    <th style="border:1px solid #ddd;padding:8px;text-align:left">Value</th>
  </tr>
  <tr>
    <td style="border:1px solid #ddd;padding:8px">Item</td>
    <td style="border:1px solid #ddd;padding:8px">123</td>
  </tr>
</table>`,
  },
  {
    id: "divider",
    label: "Divider",
    icon: Minus,
    code: `<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />`,
  },
];
