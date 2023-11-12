import { Ticket } from "../tickets";

it("tests optimistic concurrency control", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 15,
    userId: "123",
  });
  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance?.set({ price: 5 });
  secondInstance?.set({ price: 20 });

  await firstInstance?.save();

  await expect(secondInstance?.save()).rejects.toThrow();
});

it("Increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 15,
    userId: "123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
});
