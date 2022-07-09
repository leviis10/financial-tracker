import Financial from "../models/Financial";
import expressAsync from "../utils/expressAsync";

export const createNewFinancial = expressAsync(async (req, res) => {
  const financial = new Financial(req.body);
  financial.user = req.user!.id;
  await financial.save();
  res.status(201).send(financial);
});

export const getUserFinancialRecords = expressAsync(async (req, res) => {
  const financials = await Financial.find({ user: req.user!.id });
  res.send(financials);
});
