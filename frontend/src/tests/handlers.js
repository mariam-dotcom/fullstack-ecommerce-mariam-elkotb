import { http, HttpResponse } from 'msw';

const API = 'http://localhost:5000/api';

export const handlers = [
  http.get(`${API}/catalog`, () => {
    return HttpResponse.json({
      items: [
        { id: 1, title: 'Weighted Desk Lamp', summary: 'A calm lamp.', priceCents: 4900, stockCount: 10, collection: { name: 'Desk & Workspace' } },
        { id: 2, title: 'Canvas Field Bag', summary: 'Durable canvas.', priceCents: 6900, stockCount: 2, collection: { name: 'Everyday Carry' } },
      ],
      page: { current: 1, size: 8, total: 2, pages: 1 },
    });
  }),
  http.get(`${API}/collections`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Desk & Workspace' },
      { id: 2, name: 'Everyday Carry' },
    ]);
  }),
];
