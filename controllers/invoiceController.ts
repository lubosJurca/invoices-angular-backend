import { Request, Response } from "express";

import InvoiceModel from "../models/InvoiceModel";

//  ---------------- GET ALL INVOICES ----------------
export const getAllInvoices = async (req: Request, res: Response) => {
  const { filter } = req.query || "all";
  let data;
  let totalInvoices;

  try {
    if (filter !== "all" && filter !== undefined) {
      data = await InvoiceModel.find({ createdBy: req.userId, status: filter });
      totalInvoices = await InvoiceModel.countDocuments({
        createdBy: req.userId,
        status: filter,
      });
    } else {
      data = await InvoiceModel.find({
        createdBy: req.userId,
      });

      totalInvoices = await InvoiceModel.countDocuments({
        createdBy: req.userId,
      });
    }

    res.status(200).json({
      totalInvoices,
      data,
      message: "Invoices fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  ---------------- GET SINGLE INVOICE ----------------
export const getSingleInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);
    res.status(200).json(invoice);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//  ---------------- CREATE INVOICE ----------------
export const createInvoice = async (req: Request, res: Response) => {
  try {
    req.body.createdBy = req.userId;
    const invoice = await InvoiceModel.create(req.body);
    res.status(201).json({ invoice });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error: ", error });
  }
};

// ---------------- EDIT INVOICE ----------------
export const editInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await InvoiceModel.findById({ _id: id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Invoice updated", updatedInvoice });
  } catch (error) {
    console.log("Edit invoice error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- EDIT INVOICE STATUS ----------------
export const editStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await InvoiceModel.findById({ _id: id });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      { status: "paid" },
      { new: true }
    );
    res.status(200).json({ message: "Invoice status updated", updatedInvoice });
  } catch (error) {
    console.log("Edit invoice error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------- DELETE INVOICE ----------------
export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await InvoiceModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Invoice deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
