exports.requiredData = (user) => {
  return {
    email: user.email,
    name: user.name,
    _id: user._id,
    slug: user.slug,
    role: user.role,
  };
};
