$(document).ready(function () {
    // Загрузить контакты при загрузке страницы
    loadContacts();

    // Обработчик нажатия на кнопку "Новый контакт"
    $('#new-contact').on('click', function () {
        // Очистить форму и показать модальное окно
        $('#contact-form')[0].reset();
        $('#contact-modal').modal('show');
    });

    // Обработчик нажатия на кнопку "Сохранить" (для добавления нового контакта)
    $('#save-contact').off('click').on('click', function () {
        var birthDate = $('#birth-date').val();
        if (!isValidBirthDate(birthDate)) {
            return; // Прекратить выполнение, если дата рождения недопустима
        }
        var mobilePhone = $('#mobile-phone').val();
        if (!isValidPhoneNumber(mobilePhone)) {
            alert('Введите действительный номер телефона.');
            return; // Прекратить выполнение, если номер телефона недопустим
        }
        var name = $('#name').val();
        if (!isValidName(name)) {
            alert('Введите действительное имя, начинающееся с большой буквы.');
            return; // Прекратить выполнение, если имя недопустимо
        }

        var newContact = {
            name: $('#name').val(),
            mobilePhone: $('#mobile-phone').val(),
            jobTitle: $('#job-title').val(),
            birthDate: birthDate
        };

        $.ajax({
            url: '/api/contacts',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newContact),
            success: function () {
                // Закрыть модальное окно и обновить список контактов
                $('#contact-modal').modal('hide');
                loadContacts();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Ошибка AJAX-запроса: " + textStatus, errorThrown);
            }
        });
    });

    // Обработчик нажатия на кнопку "Удалить"
    $('body').on('click', '.delete-contact', function () {
        var id = $(this).data('id');
        $.ajax({
            url: '/api/contacts/' + id,
            method: 'DELETE',
            success: function () {
                // Обновить список контактов после удаления
                loadContacts();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error("Ошибка AJAX-запроса: " + textStatus, errorThrown);
            }
        });
    });

    // Обработчик нажатия на кнопку "Редактировать"
    $('body').on('click', '.edit-contact', function () {
        var id = $(this).data('id');

        // Найти контакт в таблице и получить его данные
        var row = $(this).closest('tr');
        var name = row.find('td:nth-child(1)').text();
        var mobilePhone = row.find('td:nth-child(2)').text();
        var jobTitle = row.find('td:nth-child(3)').text();
        var birthDate = row.find('td:nth-child(4)').text();

        // Заполнить форму данными контакта и показать модальное окно
        $('#name').val(name);
        $('#mobile-phone').val(mobilePhone);
        $('#job-title').val(jobTitle);
        $('#birth-date').val(formatDateToSend(birthDate)), // Установить дату рождения
            $('#contact-modal').modal('show');

        // Изменить обработчик нажатия на кнопку "Сохранить", чтобы он обновлял контакт
        $('#save-contact').off('click').on('click', function () {
            var birthDate = $('#birth-date').val();
            if (!isValidBirthDate(birthDate)) {
                return; // Прекратить выполнение, если дата рождения недопустима
            }
            var mobilePhone = $('#mobile-phone').val();
            if (!isValidPhoneNumber(mobilePhone)) {
                alert('Введите действительный номер телефона.');
                return; // Прекратить выполнение, если номер телефона недопустим
            }
            var name = $('#name').val();
            if (!isValidName(name)) {
                alert('Введите действительное имя, начинающееся с большой буквы.');
                return; // Прекратить выполнение, если имя недопустимо
            }

            var updatedContact = {
                name: $('#name').val(),
                mobilePhone: $('#mobile-phone').val(),
                jobTitle: $('#job-title').val(),
                birthDate: $('#birth-date').val() // Сохранить дату рождения
            };

            $.ajax({
                url: '/api/contacts/' + id,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedContact),
                success: function () {
                    // Закрыть модальное окно и обновить список контактов
                    $('#contact-modal').modal('hide');
                    loadContacts();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.error("Ошибка AJAX-запроса: " + textStatus, errorThrown);
                }
            });
        });
    });
});

//Формат даты для пользователя
function formatDate(dateString) {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    // Добавить ведущий ноль к дню и месяцу, если они состоят из одной цифры
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return day + '.' + month + '.' + year;
}

//Формат даты для отправки на сервер
function formatDateToSend(dateString) {
    var dateParts = dateString.split(".");
    return dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
}

//Валидность номера телефона
function isValidPhoneNumber(phoneNumber) {
    var phoneRegex = /^(\+?\d{1,4}[\s-]?)?((\(\d{1,3}\))|\d{1,3})[\s-]?\d{1,4}[\s-]?\d{1,9}(\s*(ext|x)\s*\d{1,4})?$/;
    return phoneRegex.test(phoneNumber);
}

//Валидность даты рождения
function isValidBirthDate(birthDate) {
    var today = new Date();
    var birthDate = new Date(birthDate);

    // Проверить, является ли дата рождения датой в будущем
    if (birthDate > today) {
        alert('Дата рождения не может быть в будущем');
        return false;
    }

    // Проверить, является ли дата рождения слишком ранней (старше 150 лет)
    var tooEarly = new Date();
    tooEarly.setFullYear(today.getFullYear() - 150);
    if (birthDate < tooEarly) {
        alert('Дата рождения не может быть ранее, чем 150 лет назад');
        return false;
    }

    return true;
}

//Валидность имени
function isValidName(name) {
    var nameRegex = /^[A-ZА-Я][a-zа-я]*$/;
    return nameRegex.test(name);
}

function loadContacts() {
    $.ajax({
        url: '/api/contacts',
        method: 'GET',
        success: function (data) {
            // Очистить таблицу и добавить новые строки для каждого контакта
            $('#contacts tbody').empty();
            data.forEach(function (contact) {
                $('<tr>')
                    .append($('<td>').text(contact.name))
                    .append($('<td>').text(contact.mobilePhone))
                    .append($('<td>').text(contact.jobTitle))
                    .append($('<td>').text(formatDate(contact.birthDate)))
                    .append($('<td>')
                        .append($('<button>').addClass('edit-contact').data('id', contact.id).text('Редактировать'))
                        .append($('<button>').addClass('delete-contact').data('id', contact.id).text('Удалить')))
                    .appendTo('#contacts tbody');
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Ошибка AJAX-запроса: " + textStatus, errorThrown);
        }
    });
}
