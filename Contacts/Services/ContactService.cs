using AutoMapper;
using Contacts.Dto;
using Contacts.Models;
using Contacts.Persistence;
using Contacts.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Contacts.Services
{
    public class ContactService : IContactService
    {
        private readonly ContactDbContext _context;
        private readonly IMapper _mapper;

        public ContactService(ContactDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Contact> CreateContact(ContactDto contactDto)
        {
            var contact = new Contact()
            {
                Name = contactDto.Name,
                MobilePhone = contactDto.MobilePhone,
                JobTitle = contactDto.JobTitle,
                BirthDate = contactDto.BirthDate
            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return contact;
        }

        public async Task DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ContactDto>> GetContact()
        {
            var contacts = await _context.Contacts.ToListAsync();
            var contactDto = _mapper.Map<List<ContactDto>>(contacts);
            return contactDto;
        }

        public async Task<Contact> UpdateContact(int id, ContactDto contactDto)
        {
            var contact = await _context.Contacts.FindAsync(id);

            contact.Name = contactDto.Name;
            contact.MobilePhone = contactDto.MobilePhone;
            contact.JobTitle = contactDto.JobTitle;
            contact.BirthDate = contactDto.BirthDate;

            await _context.SaveChangesAsync();

            return contact;
        }
    }
}
