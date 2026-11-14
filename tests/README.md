# Test apps/order

## Lingkungan test

Test berjalan terhadap dua database MySQL khusus (bukan DB dev `sagansa`):

- `sagansa_order_test` — klon skema utama
- `sagansa_user_order_test` — klon skema auth (`users`)

Konfigurasi ada di `.env.testing` (di-copy dari `.env`, ganti
`DB_DATABASE` → `sagansa_order_test` dan `DB_AUTH_DATABASE` →
`sagansa_user_order_test`).

## Setup awal (sekali per mesin)

```bash
# 1. Buat DB klon (skema saja)
mysql -uroot -proot -e "
  CREATE DATABASE sagansa_order_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  CREATE DATABASE sagansa_user_order_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysqldump -uroot -proot --no-data --skip-triggers --set-gtid-purged=OFF sagansa_test \
  | mysql -uroot -proot sagansa_order_test
mysqldump -uroot -proot --no-data --skip-triggers --set-gtid-purged=OFF sagansa_user \
  | mysql -uroot -proot sagansa_user_order_test

# 2. Salin data tabel lookup yang dibutuhkan FK products
for t in material_groups online_categories payment_types units; do
  mysqldump -uroot -proot --no-create-info --skip-triggers --set-gtid-purged=OFF --insert-ignore sagansa_test $t \
    | mysql -uroot -proot sagansa_order_test
done

# 3. Arahkan ulang FK lintas-DB ke klon auth (5 constraint)
mysql -uroot -proot sagansa_order_test <<'EOF'
ALTER TABLE carts DROP FOREIGN KEY carts_user_id_foreign;
ALTER TABLE carts ADD CONSTRAINT carts_user_id_foreign FOREIGN KEY (user_id) REFERENCES sagansa_user_order_test.users (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE delivery_addresses DROP FOREIGN KEY delivery_addresses_ibfk_1;
ALTER TABLE delivery_addresses ADD CONSTRAINT delivery_addresses_ibfk_1 FOREIGN KEY (user_id) REFERENCES sagansa_user_order_test.users (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE products DROP FOREIGN KEY products_user_id_foreign;
ALTER TABLE products ADD CONSTRAINT products_user_id_foreign FOREIGN KEY (user_id) REFERENCES sagansa_user_order_test.users (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE sales_orders DROP FOREIGN KEY sales_orders_ibfk_6;
ALTER TABLE sales_orders ADD CONSTRAINT sales_orders_ibfk_6 FOREIGN KEY (ordered_by_id) REFERENCES sagansa_user_order_test.users (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE sales_orders DROP FOREIGN KEY sales_orders_ibfk_7;
ALTER TABLE sales_orders ADD CONSTRAINT sales_orders_ibfk_7 FOREIGN KEY (assigned_by_id) REFERENCES sagansa_user_order_test.users (id) ON DELETE CASCADE ON UPDATE CASCADE;
EOF
```

## Menjalankan test

```bash
vendor/bin/pest
```

## Catatan penting

- `tests/Pest.php` memakai **`DatabaseTransactions`**, bukan `RefreshDatabase`.
  Skema DB dikelola lintas aplikasi di monorepo ini — `migrate:fresh` akan
  menghapus tabel yang tidak dibuat migrasi aplikasi ini.
- Insert user (`mysql_auth`) sengaja **tidak** dibungkus transaksi (lihat
  komentar di `CheckoutValidationTest`): FK dari `delivery_addresses`/
  `sales_orders` ke `users` akan saling mengunci lintas koneksi jika baris
  parent belum di-commit. DB auth test adalah klon sekali pakai, jadi
  kebocoran baris user test di sana aman.
