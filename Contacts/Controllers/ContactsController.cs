using Contacts.Dto;
using Contacts.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Contacts.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactDto>>> GetContacts()
        {
            var contactDto = await _contactService.GetContact();
            return Ok(contactDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddContact(ContactDto contactDto)
        {
            var contact = await _contactService.CreateContact(contactDto);
            return Ok(contact);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            await _contactService.DeleteContact(id);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContact(int id, ContactDto contactDto)
        {
            var contact = await _contactService.UpdateContact(id, contactDto);
            return Ok(contact);
        }
    }
}
