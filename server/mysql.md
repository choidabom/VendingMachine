```sql
show databases;
use vending_machine;

# vending machine table
CREATE TABLE IF NOT EXISTS vending_machine (
         id    INT UNSIGNED  NOT NULL AUTO_INCREMENT ,
         name         VARCHAR(30)   NOT NULL DEFAULT '',
         location     VARCHAR(30)   NOT NULL DEFAULT '',
         PRIMARY KEY  (id)
       );

# resource table
CREATE TABLE IF NOT EXISTS resource (
         id    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
         name         VARCHAR(30)   NOT NULL DEFAULT '',
         PRIMARY KEY  (id)
       );

# product table
CREATE TABLE IF NOT EXISTS product (
         id    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
         name         VARCHAR(30)   NOT NULL DEFAULT '',
         price         INT UNSIGNED NOT NULL DEFAULT 0,
         PRIMARY KEY  (id)
       );

# vending machine resource
CREATE TABLE IF NOT EXISTS vm_resource (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    vm_id INT UNSIGNED NOT NULL DEFAULT 0,
    resource_id INT UNSIGNED NOT NULL DEFAULT 0,
    name         VARCHAR(30)   NOT NULL DEFAULT '',
    quantity INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (ID),
        FOREIGN KEY  (vm_id) REFERENCES vending_machine (id),
    FOREIGN KEY  (resource_id) REFERENCES resource (id)
);

# product resource table
CREATE TABLE IF NOT EXISTS product_resource (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL DEFAULT 0,
    resource_id INT UNSIGNED NOT NULL DEFAULT 0,
    amount INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY  (product_id) REFERENCES product (id),
    FOREIGN KEY  (resource_id) REFERENCES resource (id)
);

# Order table
CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    vm_id INT UNSIGNED NOT NULL DEFAULT 0,
    product_id INT UNSIGNED NOT NULL DEFAULT 0,
    payment_id INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY  (vm_id) REFERENCES vending_machine (id),
    FOREIGN KEY  (product_id) REFERENCES product (id),
    FOREIGN KEY  (payment_id) REFERENCES payment (id)
);

# default vending machine resource
CREATE TABLE IF NOT EXISTS default_resource (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    resource_id INT UNSIGNED NOT NULL DEFAULT 0,
    name         VARCHAR(30)   NOT NULL DEFAULT '',
    quantity INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (ID),
    FOREIGN KEY  (resource_id) REFERENCES resource (id)
);

# payment table
CREATE TABLE IF NOT EXISTS payment (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name         VARCHAR(30)   NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);

```