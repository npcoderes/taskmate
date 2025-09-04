import db from "../db/db.js";

export const createTask = async (req, res) => {
  try {
    const { title, status } = req.body;
   const userId = req.user.userId;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const result = await db.query(
      "INSERT INTO tasks (title, status, userId) VALUES ($1, $2, $3) RETURNING *",
      [title, status || "pending", userId]
    );

    const task = result.rows[0];

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          createdAt: task.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE userId = $1 ORDER BY created_at DESC",
      [req.user.userId]
    );

    const tasks = result.rows.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      createdAt: task.created_at,
    }));

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: {
        tasks,
        count: tasks.length,
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await db.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (title) {
      await db.query("UPDATE tasks SET title = $1 WHERE id = $2", [title, id]);
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = result.rows[0];

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: {
        task: {
          id: task.id,
          title: task.title,
          status: task.status,
          createdAt: task.created_at,
        },
      },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTaskAnalytics = async (req, res) => {
  try {
    const totalResult = await db.query("SELECT COUNT(*) as total FROM tasks");
    const total = parseInt(totalResult.rows[0].total);

    const statusResult = await db.query(`
SELECT
    status,
    COUNT(*) AS total
FROM
    tasks

where userId = $1
GROUP BY
    status;

        `, [req.user.userId]);

    // console.log("statusResult:", statusResult.rows);
    const analytics = {
      total: total,
      pending: 0,
      in_progress: 0,
      completed: 0,
    };

    statusResult.rows.forEach((row) => {
      const status = row.status.toLowerCase().replace(" ", "_");
      analytics[status] = parseInt(row.total);
    });

    res.status(200).json({
      success: true,
      message: "Task analytics retrieved successfully",
      data: analytics,
    });
  } catch (error) {
    console.error("Get task analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
