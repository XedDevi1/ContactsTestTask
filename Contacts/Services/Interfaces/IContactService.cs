using Contacts.Dto;
using Contacts.Models;

namespace Contacts.Services.Interfaces
{
    public interface IContactService
    {
        Task<List<ContactDto>> GetContact();
        Task<Contact> CreateContact(ContactDto contactDto);
        Task<Contact> UpdateContact(int id, ContactDto contactDto);
        Task DeleteContact(int id);
    }
}
