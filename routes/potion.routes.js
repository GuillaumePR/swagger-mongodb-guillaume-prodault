const express = require("express");
const router = express.Router();
const Potion = require("../models/potion.model");
const authMiddleware = require("../auth");

// router.get("/", (req, res) => {
//   res.send("root");
// });
// router.get("/about", (req, res) => {
//   res.send("about");
// });

// routes de notre api potions
// GET /potions : lire toutes les potions
/**
 * @swagger
 * /potions:
 *   get:
 *     summary: Récupérer toutes les potions
 *     tags:
 *       - Potions
 *     responses:
 *       200:
 *         description: Liste des potions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", async (req, res) => {
  try {
    const potions = await Potion.find();
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /potions/get/{id}:
 *   get:
 *     summary: Récupérer une potion par son ID
 *     tags:
 *       - Potions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la potion
 *       500:
 *         description: Erreur serveur
 */
router.get("/get/:id", async (req, res) => {
  try {
    const potion = await Potion.find({ _id: req.params.id });
    res.json(potion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /potions : créer une nouvelle potion
/**
 * @swagger
 * /potions/new:
 *   post:
 *     summary: Créer une nouvelle potion
 *     tags:
 *       - Potions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Potion créée
 *       400:
 *         description: Erreur de validation
 */
router.post("/new", authMiddleware, async (req, res) => {
  try {
    const newPotion = new Potion(req.body);
    const savedPotion = await newPotion.save();
    res.status(201).json(savedPotion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /potions/replace/{id}:
 *   put:
 *     summary: Modifier une potion
 *     tags:
 *       - Potions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Potion mise à jour
 *       500:
 *         description: Erreur serveur
 */
router.put("/replace/:id", authMiddleware, async (req, res) => {
  try {
    const potionParams = req.body;
    await Potion.updateOne({ _id: req.params.id }, potionParams);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /potions/delete/{id}:
 *   delete:
 *     summary: Supprimer une potion
 *     tags:
 *       - Potions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Potion supprimée
 *       500:
 *         description: Erreur serveur
 */
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Potion.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /names : récupérer uniquement les noms de toutes les potions

/**
 * @swagger
 * /potions/names:
 *   get:
 *     summary: Récupérer uniquement les noms de toutes les potions
 *     tags:
 *       - Potions
 *     responses:
 *       200:
 *         description: Liste des noms des potions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *         example:
 *           ["Potion de soin", "Élixir de force", "Breuvage mystique"]
 */
router.get("/names", async (req, res) => {
  try {
    const names = await Potion.find({}, "name"); // On ne sélectionne que le champ 'name'
    res.json(names.map((p) => p.name)); // renvoyer juste un tableau de strings
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /potions/vendor/{vendor_id}:
 *   get:
 *     summary: Récupérer toutes les potions d'un vendeur spécifique
 *     tags:
 *       - Potions
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des potions du vendeur
 */
router.get("/vendor/:vendor_id", async (req, res) => {
  try {
    const potions = await Potion.find({ vendor_id: req.params.vendor_id });
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /potions/price-range:
 *   get:
 *     summary: Récupérer les potions dans une plage de prix
 *     tags:
 *       - Potions
 *     parameters:
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Liste des potions dans la plage de prix
 */
router.get("/price-range", async (req, res) => {
  try {
    const potions = await Potion.where("price")
      .gte(req.query.min)
      .lte(req.query.max);
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/distinct-categories aggregat du nombre total de catégories différentes
/**
 * @swagger
 * /potions/analytics/distinct-categories:
 *   get:
 *     summary: Obtenir le nombre total de catégories distinctes
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Nombre total de catégories
 */
router.get("/analytics/distinct-categories", async (req, res) => {
  try {
    const potions = await Potion.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories" } },
      { $count: "nombre_categories" },
    ]);
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/average-score-by-vendor aggregat du score moyen des vendeurs
/**
 * @swagger
 * /potions/analytics/average-score-by-vendor:
 *   get:
 *     summary: Obtenir le score moyen des vendeurs
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Score moyen par vendeur
 */
router.get("/analytics/average-score-by-vendor", async (req, res) => {
  try {
    const potions = await Potion.aggregate([
      { $group: { _id: "$vendor_id", moyenne: { $avg: "$score" } } },
    ]);
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/average-score-by-category aggregat du score moyen des categories
/**
 * @swagger
 * /potions/analytics/average-score-by-category:
 *   get:
 *     summary: Obtenir le score moyen des catégories
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Score moyen par catégorie
 */
router.get("/analytics/average-score-by-category", async (req, res) => {
  try {
    const potions = await Potion.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", moyenne: { $avg: "$score" } } },
    ]);
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/strength-flavor-ratio ratio entre force et parfum des potions
/**
 * @swagger
 * /potions/analytics/strength-flavor-ratio:
 *   get:
 *     summary: Calculer le ratio entre la force et le parfum des potions
 *     tags:
 *       - Analytics
 *     responses:
 *       200:
 *         description: Ratio entre force et parfum
 */
router.get("/analytics/strength-flavor-ratio", async (req, res) => {
  try {
    const potions = await Potion.aggregate([
      {
        $project: {
          ratio: { $divide: ["$ratings.strength", "$ratings.flavor"] },
        },
      }, // Calcul du ratio entre force et parfum
    ]);
    res.json(potions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/search fonction de recherche avec 3 paramètres :
// grouper par vendeur ou catégorie, metrique au choix (avg, sum, count), champ au choix (score, price, ratings).
/**
 * @swagger
 * /potions/analytics/search:
 *   get:
 *     summary: Recherche avancée d'analytics
 *     tags:
 *       - Analytics
 *     parameters:
 *       - in: query
 *         name: group
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: metric
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: champ
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Résultats de l'analyse avancée
 */
router.get("/analytics/search", async (req, res) => {
  try {
    let { group, metric, champ } = req.query;

    // Vérification des paramètres
    const validGroups = ["vendor_id", "categories"];
    const validMetrics = ["avg", "sum", "count"];

    const validChamps = ["score", "price"];

    if (
      !validGroups.includes(group) ||
      !validMetrics.includes(metric) ||
      !validChamps.includes(champ)
    ) {
      return res.status(400).json({ error: "Paramètres invalides" });
    }

    let aggregation = [];

    // Si on groupe par categories, il faut utiliser $unwind
    if (group === "categories") {
      aggregation.push({ $unwind: `$${group}` });
    }

    if (metric === "count") {
      aggregation.push({
        $group: {
          _id: `$${group}`,
          count: { $sum: 1 },
        },
      });
    } else if (metric === "sum") {
      aggregation.push({
        $group: {
          _id: `$${group}`,
          total: { $sum: `$${champ}` },
        },
      });
    } else if (metric === "avg") {
      aggregation.push({
        $group: {
          _id: `$${group}`,
          average: { $avg: `$${champ}` },
        },
      });
    }

    const result = await Potion.aggregate(aggregation);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
