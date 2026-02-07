import supabase from "../config/supabase.js";

export const testDatabase = async (req, res) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
