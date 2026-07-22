import User from '../models/User.js';

// GET /api/users  (solo admin) - segunda entidad para el CRUD administrativo
export async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// POST /api/users  (solo admin) - permite crear usuarios con rol
export async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'El correo ya esta registrado' });
    const user = await User.create({ name, email, password, role: role || 'student' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id  (solo admin)
export async function updateUser(req, res, next) {
  try {
    // Solo se actualizan los campos realmente enviados; nunca la contrasena
    // desde aqui (para eso deberia existir un flujo dedicado con hash propio).
    const updates = {};
    for (const field of ['name', 'email', 'role']) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id  (solo admin)
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propio usuario' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', id: req.params.id });
  } catch (err) {
    next(err);
  }
}
