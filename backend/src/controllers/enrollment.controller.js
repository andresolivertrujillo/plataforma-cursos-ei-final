import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

// POST /api/enrollments  (estudiante se inscribe a un curso)
export async function enroll(req, res, next) {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course || !course.active) {
      return res.status(404).json({ message: 'Curso no disponible' });
    }
    // Valida cupo
    const count = await Enrollment.countDocuments({ course: courseId, status: 'inscrito' });
    if (count >= course.capacity) {
      return res.status(409).json({ message: 'El curso no tiene cupos disponibles' });
    }
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });
    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya estas inscrito en este curso' });
    }
    next(err);
  }
}

// GET /api/enrollments/mine  (inscripciones del estudiante autenticado)
export async function myEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/enrollments/:id  (el estudiante cancela su inscripcion)
export async function cancelEnrollment(req, res, next) {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user.id,
    });
    if (!enrollment) return res.status(404).json({ message: 'Inscripcion no encontrada' });
    enrollment.status = 'cancelado';
    await enrollment.save();
    res.json({ message: 'Inscripcion cancelada', enrollment });
  } catch (err) {
    next(err);
  }
}

// GET /api/enrollments  (solo admin: todas las inscripciones)
export async function listAllEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.find()
      .populate('course', 'title category')
      .populate('student', 'name email')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}
