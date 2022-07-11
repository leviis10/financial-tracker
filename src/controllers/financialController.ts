import Financial from "../models/Financial";
import expressAsync from "../utils/expressAsync";
import ExpressError from "../utils/ExpressError";

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

export const updateFinancialRecord = expressAsync(async (req, res) => {
  const financialRecord = await Financial.findOneAndUpdate(
    { _id: req.params.id, user: req.user!.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (financialRecord === null) {
    throw new ExpressError(
      "No financial record found or this financial record is not yours",
      404
    );
  }

  res.send(financialRecord);
});
