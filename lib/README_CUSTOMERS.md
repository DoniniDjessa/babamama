# Configuration de la table ali-customers

## 1. Créer la table dans Supabase

Exécutez le script SQL suivant dans votre Supabase SQL Editor :

```sql
-- Le script se trouve dans lib/database.sql
```

Ou copiez-collez directement le contenu de `lib/database.sql` dans l'éditeur SQL de Supabase.

## 2. Migration automatique

La migration des utilisateurs existants se fait automatiquement :
- Lors de la connexion d'un utilisateur existant
- Lors de l'inscription d'un nouvel utilisateur

## 3. Structure de la table

La table `ali-customers` contient :
- `id` : UUID unique
- `auth_user_id` : Référence vers `auth.users(id)`
- `email` : Email de l'utilisateur
- `phone` : Numéro de téléphone (format international)
- `name` : Nom complet (optionnel)
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

## 4. Sécurité (RLS)

Les politiques RLS sont configurées pour que :
- Les utilisateurs ne puissent lire que leurs propres données
- Les utilisateurs ne puissent mettre à jour que leurs propres données
- L'insertion est autorisée pour les utilisateurs authentifiés

