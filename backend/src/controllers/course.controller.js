import Course from '../models/Course.js';

// GET /api/courses  (publico) con busqueda y filtro basico
export async function listCourses(req, res, next) {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

// GET /api/courses/:id
export async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

// POST /api/courses  (solo admin)
export async function createCourse(req, res, next) {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}

// PUT /api/courses/:id  (solo admin)
export async function updateCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/courses/:id  (solo admin)
export async function deleteCourse(req, res, next) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Curso no encontrado' });
    res.json({ message: 'Curso eliminado', id: req.params.id });
  } catch (err) {
    next(err);
  }
}
