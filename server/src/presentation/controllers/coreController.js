exports.getTeams = async (req, res, next) => {
  try {
    // Тут буде логіка діставання команд з БД: await Team.findAll()
    res.status(200).json({ message: 'Список команд успішно отримано', data: [] });
  } catch (error) {
    next(error); // Передаємо помилку в Global Exception Handler
  }
};

exports.getTournaments = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Список турнірів успішно отримано', data: [] });
  } catch (error) {
    next(error);
  }
};

exports.getPlayers = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Список гравців успішно отримано', data: [] });
  } catch (error) {
    next(error);
  }
};
